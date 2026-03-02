import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  Request,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LeaderboardService } from './leaderboard.service';
import { GetLeaderboardDto, GetUserQuizListDto } from './dto/leaderboard.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('leaderboard')
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('overall')
   @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get overall user rankings' })
  @ApiResponse({ status: 200, description: 'Returns paginated overall rankings' })
  async getOverallRanking(@Query() dto: GetLeaderboardDto) {
    return await this.leaderboardService.getOverallRanking(dto);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get specific user ranking' })
  @ApiResponse({ status: 200, description: 'Returns user ranking details' })
  async getUserRanking(@Req() req) {
    return await this.leaderboardService.getUserRanking(req.user.id);
  }

  @Get('my-quizzes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get logged-in user quiz history' })
  @ApiResponse({ status: 200, description: 'Returns user quiz list with scores' })
  async getUserQuizList(@Request() req, @Query() dto: GetUserQuizListDto) {
    return await this.leaderboardService.getUserQuizList(req.user.id, dto);
  }

  @Get('monthly')
  @ApiOperation({ summary: 'Get last month user rankings' })
  @ApiResponse({ status: 200, description: 'Returns last month rankings' })
  async getMonthlyRanking(@Query() dto: GetLeaderboardDto) {
    return await this.leaderboardService.getMonthlyRanking(dto);
  }
}
